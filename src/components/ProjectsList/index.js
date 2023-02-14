import './index.css'

const ProjectsList = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <li className="projects-list">
      <img className="projects-img" src={imageUrl} alt={name} />
      <p className="projects-name">{name}</p>
    </li>
  )
}
export default ProjectsList
