"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="info-page-shell">
      <div className="info-hero" style={{ textAlign: "center" }}>
        <h1>页面出错了</h1>
        <p>
          {process.env.NODE_ENV === "development"
            ? error.message
            : "发生了未知错误，请稍后重试"}
        </p>
        <button
          className="nav-button nav-button--primary"
          onClick={reset}
          style={{ marginTop: 16 }}
          type="button"
        >
          重试
        </button>
      </div>
    </main>
  );
}
