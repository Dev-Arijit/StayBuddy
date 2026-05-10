import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import OwnerDashboard from "./OwnerDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard() {

  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="p-10 text-error">
        Please login first
      </div>
    );
  }

  if (user.role === "owner") {
    return <OwnerDashboard />;
  }

  return <StudentDashboard />;
}