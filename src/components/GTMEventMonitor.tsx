import { useState, useEffect, useSyncExternalStore } from "react";
import { getEventLog, subscribe, DataLayerEvent } from "@/lib/dataLayer";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ChevronDown, ChevronUp, X } from "lucide-react";

function useEventLog() {
  return useSyncExternalStore(subscribe, getEventLog, getEventLog);
}

export default function GTMEventMonitor() {
  const events = useEventLog();
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (events.length > 0) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [events.length]);

  const last5 = events.slice(0, 5);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-body" style={{ maxWidth: 380 }}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg transition-all ${flash ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
          }`}
      >
        <Activity className="h-4 w-4" />
        GTM Monitor
        <span className="ml-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold">
          {events.length}
        </span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last 5 Events
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { window.dataLayer = []; window.location.reload(); }}
                  className="text-[10px] text-muted-foreground hover:text-accent font-medium uppercase"
                >
                  Reset
                </button>
                <X className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" onClick={() => setOpen(false)} />
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {last5.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No events yet. Navigate the site to see events fire.
                </p>
              ) : (
                last5.map((ev, i) => <EventRow key={`${ev.timestamp}-${i}`} event={ev} />)
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventRow({ event }: { event: DataLayerEvent }) {
  const [expanded, setExpanded] = useState(false);
  const { event: name, timestamp, ...rest } = event;

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          <span className="text-sm font-medium">{name}</span>
        </div>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative bg-muted/30 px-4 py-3 text-xs text-muted-foreground"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(JSON.stringify(rest, null, 2));
              }}
              className="absolute right-2 top-2 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent hover:bg-accent/20"
            >
              Copy JSON
            </button>
            <pre className="overflow-auto max-h-40">
              {JSON.stringify(rest, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
