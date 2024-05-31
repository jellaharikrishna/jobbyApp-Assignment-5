import {Link} from 'react-router-dom'
import {IoIosStar} from 'react-icons/io'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItemCard = props => {
  const {jobCardDetails} = props
  const {
    id,
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobCardDetails

  return (
    <Link to={`/jobs/${id}`} className="job-card-link">
      <li className="jobslist-card">
        <div className="logo-title-container">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="title-rating-card">
            <h1 className="title-heading">{title}</h1>
            <div className="rating-card">
              <IoIosStar className="star-rating-icon" />
              <p className="rating-heading">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-package-container">
          <div className="location-employment-type-card">
            <div className="location-card">
              <MdLocationOn className="location-icon" />
              <p className="location-heading">{location}</p>
            </div>
            <div className="employment-type-card">
              <BsBriefcaseFill className="employment-type-icon" />
              <p className="employment-type-heading">{employmentType}</p>
            </div>
          </div>
          <p className="package-heading">{packagePerAnnum}</p>
        </div>
        <hr className="hr-line" />
        <div className="description-container">
          <h1 className="description-heading">Description</h1>
          <p className="description-paragraph">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default JobItemCard
