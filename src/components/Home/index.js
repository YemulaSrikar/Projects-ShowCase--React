import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectsList from '../ProjectsList'
import Header from '../Header'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    projectsLst: [],
    activeId: categoriesList[0].id,
    status: apiConstStatus.initial,
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    this.setState({status: apiConstStatus.inprogress})
    const {activeId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }
    const fetchedData = await fetch(url, options)
    // console.log(fetchedData)
    if (fetchedData.ok === true) {
      const data = await fetchedData.json()
      // console.log(data)
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({projectsLst: updatedData, status: apiConstStatus.success})
    } else {
      this.setState({status: apiConstStatus.failure})
    }
  }

  onTriggerRetry = () => {
    this.getProjectsData()
  }

  onTriggerInput = event => {
    this.setState({activeId: event.target.value}, this.getProjectsData)
  }

  renderSuccess = () => {
    const {projectsLst} = this.state
    return (
      <>
        <ul className="projects-U-List">
          {projectsLst.map(projectDetails => (
            <ProjectsList
              projectDetails={projectDetails}
              key={projectDetails.id}
            />
          ))}
        </ul>
      </>
    )
  }

  renderFailure = () => (
    <div className="failure-cont">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-head">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-btn"
        type="button"
        onClick={this.onTriggerRetry}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-cont">
      <Loader type="ThreeDots" color="#328af2" height="40" width="40" />
    </div>
  )

  renderProjects = () => {
    const {status} = this.state
    switch (status) {
      case apiConstStatus.success:
        return this.renderSuccess()
      case apiConstStatus.failure:
        return this.renderFailure()
      case apiConstStatus.inprogress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state
    return (
      <div>
        <Header />
        <select
          className="select-lst"
          value={activeId}
          onChange={this.onTriggerInput}
        >
          {categoriesList.map(lst => (
            <option value={lst.id} key={lst.id}>
              {lst.displayText}
            </option>
          ))}
        </select>
        {this.renderProjects()}
      </div>
    )
  }
}
export default Home
