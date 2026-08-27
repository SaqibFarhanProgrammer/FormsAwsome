function LeftPanel() {
  return (
    <div className="relative  hidden w-1/2 overflow-hidden  lg:flex lg:flex-col lg:justify-end lg:p-12">
      <img
        src="https://i.pinimg.com/736x/97/21/98/972198b332ecc3b1554199f4711056b3.jpg"
        className="absolute inset-0 object-cover object-bottom"
        alt=""
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">FormsAwesome</span>
        </div>
        <h2 className="mb-3 text-3xl font-bold leading-tight text-white">
          Build. Collaborate. Innovate.
        </h2>
        <p className="max-w-md text-base leading-relaxed text-white/60">
          Empower your team with tools that make collaboration seamless, creative, and inspiring.
        </p>
      </div>
    </div>
  );
}
export default LeftPanel;
