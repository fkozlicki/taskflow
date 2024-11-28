import EditUserForm from "@/components/edit-user-form.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export default function Settings() {
  return (
    <div>
      <Card className="max-w-[600px]">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Fill out the form to edit profile</CardDescription>
        </CardHeader>
        <CardContent>
          <EditUserForm />
        </CardContent>
      </Card>
    </div>
  );
}
