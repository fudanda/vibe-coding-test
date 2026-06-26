import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/project-docs")({
	component: ProjectDocsLayout,
});

function ProjectDocsLayout() {
	return <Outlet />;
}
