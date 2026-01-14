export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-zinc-50 mb-4">
          Добро пожаловать в систему управления трудовыми отношениями
        </h1>
        <p className="text-lg text-zinc-400 mb-8">
          Используйте меню слева для навигации по документам и справочникам.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-2">
              📄 Документы
            </h2>
            <p className="text-zinc-400">
              Управляйте трудовыми договорами, приказами о приёме и увольнении
              сотрудников.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-zinc-50 mb-2">
              📚 Справочники
            </h2>
            <p className="text-zinc-400">
              Управляйте организациями, отделами, должностями и данными
              сотрудников.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
