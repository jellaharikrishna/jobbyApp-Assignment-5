import {IoIosStar} from 'react-icons/io'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    jobDescription,
  } = similarJobDetails

  return (
    <li className="similar-job-card">
      <div className="similar-job-logo-title-container">
        <img
          className="similar-job-company-logo"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="similar-job-title-rating-card">
          <h1 className="similar-job-title-heading">{title}</h1>
          <div className="similar-job-rating-card">
            <IoIosStar className="similar-job-star-rating-icon" />
            <p className="similar-job-rating-heading">{rating}</p>
          </div>
        </div>
      </div>

      <div className="similar-job-description-container">
        <h1 className="similar-job-description-heading">Description</h1>
        <p className="similar-job-description-paragraph">{jobDescription}</p>
      </div>

      <div className="similar-job-location-job-type-container">
        <div className="similar-job-location-employment-type-card">
          <div className="similar-job-location-card">
            <MdLocationOn className="similar-job-location-icon" />
            <p className="similar-job-location-heading">{location}</p>
          </div>
          <div className="similar-job-employment-type-card">
            <BsBriefcaseFill className="similar-job-employment-type-icon" />
            <p className="similar-job-employment-type-heading">
              {employmentType}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
