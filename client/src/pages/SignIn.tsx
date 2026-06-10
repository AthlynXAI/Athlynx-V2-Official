import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { AuthShell } from "./_AuthShell";

export default function SignIn() {
  return (
    <RouteErrorBoundary>
      <AuthShell mode="signin" />
    </RouteErrorBoundary>
  );
}
