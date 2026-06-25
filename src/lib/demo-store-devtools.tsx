import { EventClient } from "@tanstack/devtools-event-client";
import { useEffect, useState } from "react";

import { fullName, statusSummary, store } from "./demo-store";

type EventMap = {
	"store-devtools:state": {
		firstName: string;
		lastName: string;
		role: string;
		mode: string;
		focus: string;
		confidence: number;
		fullName: string;
		statusSummary: string;
	};
};

class StoreDevtoolsEventClient extends EventClient<EventMap> {
	constructor() {
		super({
			pluginId: "store-devtools",
		});
	}
}

const sdec = new StoreDevtoolsEventClient();

function getSnapshot(): EventMap["store-devtools:state"] {
	return {
		firstName: store.state.firstName,
		lastName: store.state.lastName,
		role: store.state.role,
		mode: store.state.mode,
		focus: store.state.focus,
		confidence: store.state.confidence,
		fullName: fullName.state,
		statusSummary: statusSummary.state,
	};
}

export const storeDevtoolsSubscription = store.subscribe(() => {
	sdec.emit("state", getSnapshot());
});

function DevtoolPanel() {
	const [state, setState] =
		useState<EventMap["store-devtools:state"]>(getSnapshot);

	useEffect(() => {
		return sdec.on("state", (e) => setState(e.payload));
	}, []);

	const rows = [
		["First Name", state.firstName],
		["Last Name", state.lastName],
		["Role", state.role],
		["Mode", state.mode],
		["Focus", state.focus],
		["Confidence", `${state.confidence}%`],
		["Full Name", state.fullName],
		["Summary", state.statusSummary],
	];

	return (
		<div className="grid gap-3 p-4 text-sm">
			{rows.map(([label, value]) => (
				<div key={label} className="grid grid-cols-[8rem_1fr] gap-3">
					<div className="demo-muted whitespace-nowrap font-bold">{label}</div>
					<div className="min-w-0 truncate">{value}</div>
				</div>
			))}
		</div>
	);
}

export default {
	name: "TanStack Store",
	render: <DevtoolPanel />,
};
