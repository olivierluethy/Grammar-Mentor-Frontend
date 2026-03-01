import Link from "next/link"

export function ContactBanner() {
  return (
    <section className="bg-gray-950 pb-6 sm:pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Padding von p-8 auf p-5 reduziert für Mobile */}
        <div className="flex flex-col items-center justify-between gap-5 rounded-xl border border-gray-800 bg-gray-900/50 p-5 shadow-xl md:flex-row md:p-10">
          
          <div className="text-center md:text-left">
            {/* Titel-Grösse auf Mobile reduziert */}
            <h2 className="mb-1 sm:mb-3 text-xl sm:text-2xl font-bold tracking-tight text-white">
              Need more?
            </h2>
            {/* Text-Grösse auf Mobile reduziert (text-sm) */}
            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-gray-400">
              We provide bespoke services for clients who have other document formats to process. 
              Let us know how we can help!
            </p>
          </div>

          <div className="w-full shrink-0 md:w-auto">
            <Link 
              href="/contact" 
              className="inline-block w-full text-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95 md:w-auto md:px-8 md:py-3"
            >
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
