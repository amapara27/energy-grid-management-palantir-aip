import {
  fetchTransformers,
  fetchCircuits,
  fetchWorkOrders,
  fetchAllForecasts,
  transformerCircuitMap,
} from "@/lib/api";
import { DashboardShell } from "@/components/DashboardShell";

export default async function Page() {
  const [transformers, circuits, workOrders, forecasts] = await Promise.all([
    fetchTransformers(),
    fetchCircuits(),
    fetchWorkOrders(),
    fetchAllForecasts(),
  ]);

  return (
    <DashboardShell
      transformers={transformers}
      circuits={circuits}
      workOrders={workOrders}
      forecasts={forecasts}
      transformerCircuitMap={transformerCircuitMap}
    />
  );
}
