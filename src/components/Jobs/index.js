import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobItemCard from '../JobItemCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationBasedList = [
  {
    locationName: 'Hyderabad',
    locationId: 'HYDERABAD',
  },
  {
    locationName: 'Bangalore',
    locationId: 'BANGALORE',
  },
  {
    locationName: 'Chennai',
    locationId: 'CHENNAI',
  },
  {
    locationName: 'Delhi',
    locationId: 'DELHI',
  },
  {
    locationName: 'Mumbai',
    locationId: 'MUMBAI',
  },
]

class Jobs extends Component {
  state = {
    searchInput: '',
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    empolymentList: [],
    salaryRange: '',
    locationsList: [],
    jobsList: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  // GET PROFILE API
  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')

    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(profileApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const updatedData = {
        imageUrl: data.profile_details.profile_image_url,
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {profileDetails} = this.state
    const {imageUrl, name, shortBio} = profileDetails

    return (
      <div className="profile-container">
        <img src={imageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderRetryView = () => (
    <div className="retry-container">
      <button
        type="button"
        className="retry-btn"
        onClick={() => this.getProfileDetails()}
      >
        Retry
      </button>
    </div>
  )

  renderingProfileApi = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderRetryView()
      default:
        return null
    }
  }

  // GET JOBSLISTS API
  getJobsDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')

    this.setState({jobsApiStatus: apiStatusConstants.inProgress})

    const {searchInput, empolymentList, salaryRange, locationsList} = this.state

    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${empolymentList}&minimum_package=${salaryRange}&location=${locationsList}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const updatedData = data.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        title: each.title,
        rating: each.rating,
        location: each.location,
        employmentType: each.employment_type,
        packagePerAnnum: each.package_per_annum,
        jobDescription: each.job_description,
      }))
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onKeydownInput = event => event.key === 'Enter' && this.getJobsDetails()

  renderMobileSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="mobile-search-input-container">
        <input
          type="search"
          value={searchInput}
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onKeydownInput}
        />
        <button
          type="button"
          aria-label="close"
          data-testid="searchButton"
          className="search-icon-btn"
          onClick={() => this.getJobsDetails()}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderDesktopSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="desktop-search-input-container">
        <input
          type="search"
          value={searchInput}
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onKeydownInput}
        />
        <button
          type="button"
          aria-label="close"
          data-testid="searchButton"
          className="search-icon-btn"
          onClick={() => this.getJobsDetails()}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  onChangeEmploymentType = event => {
    const employmentType = event.target.id
    const {empolymentList} = this.state

    if (empolymentList.includes(employmentType)) {
      const updatedList = empolymentList.filter(
        eachType => eachType !== employmentType,
      )
      this.setState({empolymentList: updatedList}, this.getJobsDetails)
    } else {
      this.setState(
        prevState => ({
          empolymentList: [...prevState.empolymentList, employmentType],
        }),
        this.getJobsDetails,
      )
    }
  }

  renderTypeOfEmpolyment = () => (
    <div className="employment-container">
      <hr className="hr-line" />
      <h1 className="employment-heading">Type of Employment</h1>
      <ul className="employment-list-container">
        {employmentTypesList.map(eachType => (
          <li className="employment-list" key={eachType.employmentTypeId}>
            <input
              value={eachType.label}
              type="checkbox"
              className="checkbox-input"
              id={eachType.employmentTypeId}
              onChange={this.onChangeEmploymentType}
            />
            <label
              htmlFor={eachType.employmentTypeId}
              className="checkbox-label"
            >
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  onChangeSalaryRange = event => {
    const salaryPackage = event.target.id
    this.setState({salaryRange: salaryPackage}, this.getJobsDetails)
  }

  renderSalaryRange = () => (
    <div className="salaryrange-container">
      <hr className="hr-line" />
      <h1 className="salaryrange-heading">Salary Range</h1>
      <ul className="salaryrange-list-container">
        {salaryRangesList.map(eachSalary => (
          <li className="salaryrange-list" key={eachSalary.salaryRangeId}>
            <input
              value={eachSalary.label}
              type="radio"
              className="radio-input"
              id={eachSalary.salaryRangeId}
              onChange={this.onChangeSalaryRange}
              name="choose"
            />
            <label
              htmlFor={eachSalary.salaryRangeId}
              className="radio-label"
              name="choose"
            >
              {eachSalary.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  onChangeLocationName = event => {
    const userLocationName = event.target.id
    const {locationsList} = this.state

    if (locationsList.includes(userLocationName)) {
      const updatedList = locationsList.filter(
        eachLocation => eachLocation !== userLocationName,
      )
      this.setState({locationsList: updatedList}, this.getJobsDetails)
    } else {
      this.setState(
        prevState => ({
          locationsList: [...prevState.locationsList, userLocationName],
        }),
        this.getJobsDetails,
      )
    }
  }

  renderLocationBased = () => (
    <div className="locationbased-container">
      <hr className="hr-line" />
      <h1 className="locationbased-heading">Locations List</h1>
      <ul className="locationbased-list-container">
        {locationBasedList.map(eachLocation => (
          <li className="locationbased-list" key={eachLocation.locationId}>
            <input
              value={eachLocation.locationName}
              type="checkbox"
              className="checkbox-input"
              id={eachLocation.locationId}
              onChange={this.onChangeLocationName}
            />
            <label htmlFor={eachLocation.locationId} className="checkbox-label">
              {eachLocation.locationName}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderJobsView = () => {
    const {jobsList} = this.state

    return jobsList.length > 0 ? (
      <ul className="jobslist-container">
        {jobsList.map(eachJob => (
          <JobItemCard key={eachJob.id} jobCardDetails={eachJob} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          className="no-jobs-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={() => this.getJobsDetails()}
      >
        Retry
      </button>
    </div>
  )

  renderingJobsApi = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderJobsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="content-1">
            {this.renderMobileSearchInput()}
            {this.renderingProfileApi()}
            {this.renderTypeOfEmpolyment()}
            {this.renderSalaryRange()}
            {this.renderLocationBased()}
          </div>

          <div className="content-2">
            {this.renderDesktopSearchInput()}
            {this.renderingJobsApi()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
