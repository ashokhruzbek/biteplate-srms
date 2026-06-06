function PageHeader({ title, description }) {
  return (
    <section className="page-header" aria-labelledby="page-title">
      <h1 id="page-title">{title}</h1>
      <p>{description}</p>
    </section>
  )
}

export default PageHeader
