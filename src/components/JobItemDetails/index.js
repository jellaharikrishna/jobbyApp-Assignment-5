import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {IoIosStar} from 'react-icons/io'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetailsData: {},
    skillDataList: [],
    similarJobsList: [],
    jobItemApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobsItemDetails()
  }

  getJobsItemDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')

    this.setState({jobItemApiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobDetailsApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const updatedJobDetailsData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        rating: data.job_details.rating,
        packagePerAnnum: data.job_details.package_per_annum,
        title: data.job_details.title,
        lifeAtCompanyDescription: data.job_details.life_at_company.description,
        lifeAtCompanyImageUrl: data.job_details.life_at_company.image_url,
      }

      const updatedSkillsData = data.job_details.skills.map(eachSkill => ({
        skillName: eachSkill.name,
        skillImageUrl: eachSkill.image_url,
      }))

      const updatedSimilarJobsData = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobItemDetailsData: updatedJobDetailsData,
        skillDataList: updatedSkillsData,
        similarJobsList: updatedSimilarJobsData,
        jobItemApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobItemApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="job-item-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemDetailsView = () => {
    const {jobItemDetailsData, skillDataList, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      packagePerAnnum,
      title,
      lifeAtCompanyDescription,
      lifeAtCompanyImageUrl,
    } = jobItemDetailsData

    return (
      <>
        <div className="job-item-card">
          <div className="job-item-logo-title-container">
            <img
              className="job-item-company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="job-item-title-rating-card">
              <h1 className="job-item-title-heading">{title}</h1>
              <div className="job-item-rating-card">
                <IoIosStar className="job-item-star-rating-icon" />
                <p className="job-item-rating-heading">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-location-package-container">
            <div className="job-item-location-employment-type-card">
              <div className="job-item-location-card">
                <MdLocationOn className="job-item-location-icon" />
                <p className="job-item-location-heading">{location}</p>
              </div>
              <div className="job-item-employment-type-card">
                <BsBriefcaseFill className="job-item-employment-type-icon" />
                <p className="job-item-employment-type-heading">
                  {employmentType}
                </p>
              </div>
            </div>
            <p className="job-item-package-heading">{packagePerAnnum}</p>
          </div>
          <hr className="job-item-hr-line" />

          <div className="job-item-description-container">
            <div className="job-item-description-heading-visit-card">
              <h1 className="job-item-description-heading">Description</h1>
              <a href={companyWebsiteUrl} className="job-item-link">
                <p className="job-item-visit-heading">Visit</p>
                <FiExternalLink className="job-item-visit-link-icon" />
              </a>
            </div>
            <p className="job-item-description-paragraph">{jobDescription}</p>
          </div>

          <h1 className="job-item-skill-heading">Skills</h1>
          <ul className="job-item-skill-lists-container">
            {skillDataList.map(eachSkill => (
              <li
                className="job-item-skill-list-card"
                key={eachSkill.skillName}
              >
                <img
                  className="job-item-skill-icon"
                  src={eachSkill.skillImageUrl}
                  alt={eachSkill.skillName}
                />
                <p className="job-item-skill-name">{eachSkill.skillName}</p>
              </li>
            ))}
          </ul>

          <h1 className="job-item-life-at-company-heading">Life at Company</h1>
          <div className="job-item-life-at-company-container">
            <p className="job-item-life-at-company-description">
              {lifeAtCompanyDescription}
            </p>
            <img
              className="job-item-life-at-company-image"
              src={lifeAtCompanyImageUrl}
              alt="life at company"
            />
          </div>
        </div>

        <div className="similar-jobs-container">
          <h1 className="similar-jobs-title">Similar Jobs</h1>
          <ul className="similar-jobs-lists-container">
            {similarJobsList.map(eachJob => (
              <SimilarJobs key={eachJob.id} similarJobDetails={eachJob} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderRetryFailureView = () => (
    <div className="job-item-failure-view-container">
      <img
        className="job-item-failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="job-item-failure-view-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="job-item-failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="job-item-retry-btn"
        onClick={() => this.getJobsItemDetails()}
      >
        Retry
      </button>
    </div>
  )

  renderingJobItemDetailsApi = () => {
    const {jobItemApiStatus} = this.state

    switch (jobItemApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderJobItemDetailsView()
      case apiStatusConstants.failure:
        return this.renderRetryFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderingJobItemDetailsApi()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
