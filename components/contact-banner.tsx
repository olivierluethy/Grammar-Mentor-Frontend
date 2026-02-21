import Link from "next/link"

export function ContactBanner() {
  return (
    <section className="bg-gray-950 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl md:flex-row md:p-10">
          
          <div className="text-center md:text-left">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-white">
              Need more?
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-gray-400">
              We provide bespoke services for clients who have other document formats to process. 
              Let us know how we can help!
            </p>
          </div>

          <div className="shrink-0">
            <Link 
              href="/contact" 
              className="inline-block rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95"
            >
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}