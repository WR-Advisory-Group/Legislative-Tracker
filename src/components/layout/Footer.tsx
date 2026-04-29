export default function Footer() {
  return (
    <footer className="bg-mb-bg-black text-white py-12 px-4 sm:px-6 lg:px-20 mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-lg font-bold">WR Advisory Group</span>
          <p className="text-mb-text-light text-sm mt-1">Legislative Tracker — Philippine Legislature Monitor</p>
        </div>
        <p className="text-mb-text-light text-sm">
          © {new Date().getFullYear()} WR Advisory Group. Internal use only.
        </p>
      </div>
    </footer>
  );
}
