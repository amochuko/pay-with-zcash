import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer text-center mb-4">
      <ul className="flex flex-col justify-center gap-1">
        <li>©{new Date().getFullYear()} Pay With Zcash</li>
        <li>
          <Link
            className="hover:text-[#FFB400] hover:underline"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
        </li>
      </ul>
    </footer>
  );
}
