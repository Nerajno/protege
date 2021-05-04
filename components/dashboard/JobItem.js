import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { db } from 'utils/db'

import Trash from 'assets/images/icons/trash'
import Edit from 'assets/images/icons/edit'
import Link from 'next/link'

const JobItem = ({ job }) => {
  const router = useRouter()
  const { displayName } = router.query

  const deleteJob = async () => {
    await db.collection('jobs').doc(job.id).delete()
  }

  return (
    <li className='grid items-center mb-4 p-3 text-sm bg-white border-l-4 border-teal-500 rounded shadow grid-cols-12'>
      <p className='col-span-4 font-bold'>
        <a href='#'>{job.jobtitle}</a>
      </p>
      <p className='col-span-3 opacity-75'>32</p>
      <p className='col-span-2 opacity-75'>March 21, 2021</p>
      <p
        className={`col-span-1 capitalize ${
          job.status === 'active' ? 'text-green-600' : 'text-error-full'
        }`}
      >
        {job.status}
      </p>
      <p className='col-span-2 flex items-center justify-end'>
        <Link href={`/company/${displayName}/${job.id}/edit`}>
          <a className='opacity-50 hover:opacity-100 mr-6'>
            <Edit />
          </a>
        </Link>
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
  }).isRequired,
}

export default JobItem
