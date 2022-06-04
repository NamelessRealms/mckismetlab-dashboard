import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { Spinner } from "react-bootstrap";

interface IProps {
    children: ReactNode;
}

export default function AuthGuard(props: IProps) {

    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signIn");
        }
    }, [router]);

    if (status === "loading") {
        return (
            <div className="row justify-content-center align-items-center align-content-center" style={{ height: "100vh" }}>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/auth/signIn");
        return null;
    }

    if(status === "authenticated") {
        return <>{props.children}</>;
    }

    return null;
}