import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-black flex flex-col lg:flex-row justify-between p-16'>
      <img src='/icons/maams-footer.svg' className='max-w-48' alt='MAAMS Logo' />
      <div className='flex flex-col lg:flex-row gap-8 lg:gap-32 justify-between text-white mt-8 lg:mt-0'>
        <div className=''>
          <div className='font-bold mb-4'>Researcher</div>
          <div className=''>Ari Harsono</div>
        </div>
        <div className=''>
          <div className='font-bold mb-4'>Developers</div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-4'>
            <div className=''>Nicholas Sidharta</div>
            <div className=''>Adly Renadi Raksanagara</div>
            <div className=''>Raditya Aditama</div>
            <div className=''>Naila Shafirni Hidayat</div>
            <div className=''>Rania Maharani Narendra</div>
            <div className=''>Bagas Shalahuddin Wahid</div>
            <div className=''>Rayhan Putra Randi</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
