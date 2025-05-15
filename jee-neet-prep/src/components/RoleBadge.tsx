const roleMap: Record<string, { label: string; color: string }> = {
  Developer: { label: '🛠️ Developer', color: 'bg-purple-100 text-purple-800' },
  Admin: { label: '🧑‍💼 Admin', color: 'bg-blue-100 text-blue-800' },
  Teacher: { label: '🧑‍🏫 Teacher', color: 'bg-green-100 text-green-800' },
  Student: { label: '👨‍🎓 Student', color: 'bg-yellow-100 text-yellow-800' },
};

export default function RoleBadge({ role }: { role: string }) {
  const { label, color } = roleMap[role] || { label: role, color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{label}</span>
  );
} 