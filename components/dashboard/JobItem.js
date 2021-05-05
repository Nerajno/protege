import PropTypes from 'prop-types'
import { db } from 'utils/db'

import Trash from 'assets/images/icons/trash'
import Edit from 'assets/images/icons/edit'

import { useEditJob } from 'store/edit-job_store'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const JobItem = ({ job }) => {
  const router = useRouter()
  const [applicants, setApplicants] = useState()
  const setEditJob = useEditJob((s) => s.setEditJob)
  const { displayName } = router.query

  useEffect(() => {
    async function fetchApplications() {
      const applications = await db
        .collection('applications')
        .where('jobId', '==', job.id)
        .get()

      const applicationData = applications.docs.map((documentSnapshot) => {
        const entry = documentSnapshot.data()
        const doc = documentSnapshot

        return {
          id: doc.id,
          candidateId: entry.candidateId,
          jobId: entry.jobId,
        }
      })
      setApplicants(applicationData)
    }

    fetchApplications()
  }, [])

  const deleteJob = async () => {
    try {
      await db.collection('jobs').doc(job.id).delete()
    } catch {
      alert('oops something went wrong')
    }
  }

  const editJob = () => {
    setEditJob({ job })
    router.push(`/company/${displayName}/${job.id}/edit`)
  }

  return (
    <li className='grid items-center mb-4 p-3 text-sm bg-white border-l-4 border-teal-500 rounded shadow grid-cols-12'>
      <p className='col-span-4 font-bold'>
        <a href='#'>{job.jobtitle}</a>
      </p>
      <p className='col-span-3 opacity-75'>{applicants?.length + 1}</p>
      {/* <p className='col-span-2 opacity-75'>{job.postedAt.toDate()}</p> */}
      <p
        className={`col-span-1 capitalize ${
          job.status === 'active' ? 'text-green-600' : 'text-error-full'
        }`}
      >
        {job.status}
      </p>
      <p className='col-span-2 flex items-center justify-end'>
        <button
          className='opacity-50 hover:opacity-100 mr-6'
          type='button'
          onClick={editJob}
        >
          <Edit />
        </button>
        <button
          className='opacity-50 hover:opacity-100 text-error-full'
          type='button'
          onClick={() => {
            if (
              // eslint-disable-next-line no-alert
              window.confirm(
                'This is permanant action. Are you sure you want to delete this job?'
              )
            )
              deleteJob()
          }}
        >
          <Trash />
        </button>
      </p>
    </li>
  )
}

JobItem.propTypes = {
  job: PropTypes.shape({
    jobtitle: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    postedAt: PropTypes.shape().isRequired,
  }).isRequired,
}

export default JobItem
