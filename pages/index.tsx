import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";

export default function ViewManager() {
  const router = useRouter();
  router.push("/panel");
}

ViewManager.requireAuth = true;