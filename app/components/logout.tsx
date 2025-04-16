import { Form } from "react-router";

export default function Logout({ className: className }: { className?: string }) {
  // Accept className as a prop
  return (
    <Form action="/admin/logout" method="post">
      <button
        type="submit"
        className={`${className || "btn btn-ghost"}`} // Use className prop
      >
        Logout
      </button>
    </Form>
  );
}
