function SectionCard({ id, title, description, children }) {
  return (
    <section className="section-card" id={id}>
      <div className="section-card__header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      <div className="section-card__body">{children}</div>
    </section>
  )
}

export default SectionCard
