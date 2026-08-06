import { MdLinkButton } from '../md-button'

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-center text-on-primary md-elevation-2 sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-on-primary/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-on-primary/10"
        />
        <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-normal tracking-tight sm:text-4xl">
          Start studying smarter today
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-pretty text-on-primary/90">
          Join thousands of students using StudySync to plan, study and reach
          their academic goals with AI.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <MdLinkButton href="/signup" variant="tonal" size="lg">
            Get Started Free
          </MdLinkButton>
          <MdLinkButton
            href="#pricing"
            variant="text"
            size="lg"
            className="text-on-primary"
          >
            View Pricing
          </MdLinkButton>
        </div>
      </div>
    </section>
  )
}
