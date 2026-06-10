import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { AuthShell } from "./_AuthShell";

export default function SignUp() {
  return (
    <RouteErrorBoundary>
      <AuthShell mode="signup" />
    </RouteErrorBoundary>
  );
}
