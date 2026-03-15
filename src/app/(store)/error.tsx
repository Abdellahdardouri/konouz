'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto my-16 flex max-w-xl flex-col items-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand">
        <span className="font-cairo text-2xl text-purple">!</span>
      </div>
      <h2 className="font-cairo text-2xl font-bold text-veryDarkPurple">حدث خطأ!</h2>
      <p className="font-cairo text-lg leading-relaxed text-darkPurple">
        حدث خطأ في المتجر. يرجى المحاولة مرة أخرى.
      </p>
      <button
        className="rounded-lg bg-espresso px-8 py-3 font-cairo text-[18px] font-semibold text-white transition-all duration-300 hover:bg-gold hover:text-espresso hover:shadow-warm-md hover:scale-105 active:scale-[0.98]"
        onClick={() => reset()}
      >
        حاول مرة أخرى
      </button>
    </div>
  );
}
