function LeftPanel() {
  return (
    <div className="relative my-2 ml-2 rounded-2xl mask-b-to overflow-hidden hidden w-1/2 lg:flex lg:flex-col lg:justify-end lg:p-12">
      <img
        src="https://i.pinimg.com/1200x/04/ce/f0/04cef00dc3f36924c8ad59ab9451ff43.jpg"
        className=" absolute -hue-rotate-15 top-0 left-0 h-screen w-full  object-cover object-bottom"
        alt=""
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
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
          <span className="text-lg font-semibold text-white">FormsAwsome</span>
        </div>
        <h2 className="text-3xl font-bold text-white leading-tight mb-3">
          Build. Collaborate. Innovate.
        </h2>
        <p className="text-base text-white/60 leading-relaxed max-w-md">
          Empower your team with tools that make collaboration seamless, creative, and inspiring.
        </p>
      </div>
    </div>
  );
}

export default LeftPanel;
