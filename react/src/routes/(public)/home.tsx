import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

export default function Home() {
    return (
        <div>
            Welcome to Taskflow
            <div className="flex gap-2">
                <Button asChild>
                    <Link to="/sign-up">Sign Up</Link>
                </Button>
                <Button asChild>
                    <Link to="/sign-in">Sign In</Link>
                </Button>
            </div>
        </div>
    )
}
