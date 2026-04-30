import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalCount = registrations.length;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCount = registrations.filter(
    (r) => r.createdAt >= todayStart,
  ).length;

  return (
    <main className="admin-shell">
      <div className="admin-container">
        <header className="admin-header">
          <h1>报名数据管理</h1>
          <div className="admin-stats">
            <span className="admin-stat">
              总提交：<strong>{totalCount}</strong>
            </span>
            <span className="admin-stat">
              今日新增：<strong>{todayCount}</strong>
            </span>
          </div>
        </header>

        {registrations.length === 0 ? (
          <div className="admin-table-wrap">
            <p className="admin-empty">暂无报名数据</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-time">提交时间</th>
                  <th>珠子大小</th>
                  <th>身高</th>
                  <th>体重</th>
                  <th>估算手围</th>
                  <th>风格偏好</th>
                  <th>预算</th>
                  <th>色彩偏好</th>
                  <th>质感偏好</th>
                  <th>配饰类型</th>
                  <th>特殊要求</th>
                  <th className="col-synced">同步</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr key={r.id}>
                    <td className="col-id">{r.id}</td>
                    <td className="col-time">
                      {r.createdAt.toLocaleString("zh-CN", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td title={r.beadSizes}>{r.beadSizes}</td>
                    <td>{r.height}cm</td>
                    <td>{r.weight}kg</td>
                    <td title={r.wristEstimate}>{r.wristEstimate}</td>
                    <td title={r.combinations}>{r.combinations}</td>
                    <td title={r.exactBudget || r.budgetPreset}>
                      {r.exactBudget || r.budgetPreset}
                    </td>
                    <td title={r.colorIntensity}>{r.colorIntensity}</td>
                    <td title={r.textures}>{r.textures}</td>
                    <td title={r.accessories}>{r.accessories}</td>
                    <td title={r.requirements}>
                      {r.requirements || "-"}
                    </td>
                    <td className="col-synced">
                      {r.syncedToTencentDoc ? (
                        <span className="admin-sync-yes">已同步</span>
                      ) : (
                        <span className="admin-sync-no">未同步</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
