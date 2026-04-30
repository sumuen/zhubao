import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="info-page-shell">
      <div className="info-hero" style={{ textAlign: "center" }}>
        <h1>页面不存在</h1>
        <p>您访问的页面未找到</p>
        <Link
          href="/"
          className="nav-button nav-button--primary"
          style={{ marginTop: 16, textDecoration: "none", display: "inline-flex" }}
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
