export default function RenderedContent({ htmlContent }) {
  return (
    <div className="prose prose-sm -mx-[15px]">
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
