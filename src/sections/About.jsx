import Marquee from '../components/Marquee.jsx'
import { CharReveal, Counter, Pinned, Reveal, WordReveal } from '../components/Reveal.jsx'
import { useT } from '../i18n.jsx'

export default function About() {
  const { t } = useT()
  return (
    <section id="about" className="about">
      <Marquee text={t.marquee} />
      <div className="container about-inner">
        <Reveal as="span" className="eyebrow">
          {t.about.eyebrow}
        </Reveal>
        <WordReveal text={t.about.statement} className="display about-statement" />

        <Pinned className="about-pin">
          {(progress) => (
            <>
              <div className="about-cols">
                <CharReveal text={t.about.p1} progress={progress} range={[0.02, 0.36]} />
                <CharReveal text={t.about.p2} progress={progress} range={[0.36, 0.7]} />
              </div>
              <div className="about-sign">
                <CharReveal
                  as="span"
                  className="eyebrow"
                  toColor="#6f6a62"
                  text={`— ${t.about.signature}`}
                  progress={progress}
                  range={[0.7, 0.8]}
                />
              </div>
            </>
          )}
        </Pinned>

        <div className="stats">
          {t.about.stats.map((s, i) => (
            <Reveal className="stat" key={s.label} delay={i * 0.08}>
              <span className="display stat-n">
                {s.text ? (
                  <span className="stat-text">
                    {s.text.split('/').map((part, k) => (
                      <span key={part}>
                        {k > 0 && <i>/</i>}
                        {part}
                      </span>
                    ))}
                  </span>
                ) : (
                  <Counter to={s.to} suffix={s.suffix} />
                )}
              </span>
              <span className="eyebrow muted">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
