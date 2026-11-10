// GENERATED — ad-hoc Spring canvas page fork (Next App Router / RSC).
// Confined to the reserved /__spring_canvas__/c44ece700f1b location. Renders the
// "populated" state at the code seam. Do not edit.
/* eslint-disable */
import { SpringCanvasBoundary } from "./__adhoc_boundary";

// Never statically cache the ad-hoc render: the stubbed state is per-request.
export const dynamic = "force-dynamic";

// The state render lives in the boundary's CHILDREN — a throw here surfaces the boundary's
// rev-marked fallback rather than an unmarked framework error page.
async function SpringCanvasInner() {
    // No server data seam detected; the ad-hoc page renders the state marker only.
    const rows = [{ id: "spring-canvas" }];
  return (
    <>
      <h1>Spring canvas</h1>
      <p>state: populated</p>
      <ul>
        {rows.map((row, i) => (
          <li key={(row && (row.event_id || row.id)) || i}>{String((row && row.event_name) || "row")}</li>
        ))}
      </ul>
    </>
  );
}

export default function SpringCanvasPage() {
  // data-adhoc-rev lives on the boundary root (rendered in BOTH the ok and error branch),
  // so the render oracle confirms the RIGHT frame landed even when the state render threw.
  return (
    <SpringCanvasBoundary>
      {/* @ts-expect-error async server component child */}
      <SpringCanvasInner />
    </SpringCanvasBoundary>
  );
}
