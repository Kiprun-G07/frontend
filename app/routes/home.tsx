import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GPS UTM" },
    { name: "description", content: "Gerakan Pengunaan Siswa!" },
  ];
}
import { Link } from "react-router";

export default function Home() {
  return (
    <main className="px-15 py-12">
      <section className="max-w-3xl mx-auto">
        <Welcome />
        <div className="mt-8">
          <Link to="/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
