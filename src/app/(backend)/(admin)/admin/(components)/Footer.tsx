export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex justify-center my-2 text-slate-600 text-sm">
      &copy; {year} Pay with Zcash
    </footer>
  );
}
