function DashboardSection({ title, description, children }) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section__header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      <div className="dashboard-section__body">{children}</div>
    </section>
  )
}

export default DashboardSection
