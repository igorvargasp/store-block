import React, { useState } from 'react'
import { TimeSplit } from './typings/global'
import { tick } from './utils/time'
import { useCssHandles } from "vtex.css-handles",
import { useQuery } from 'react-apollo'

import useProduct from 'vtex.product-context/useProduct'

import productReleaseDate from './queries/productReleaseDate.graphql'


interface CountdownProps { targetDate: string, title: string }

const CSS_HANDLES = ["container","countdown", ]
const DEFAULT_TARGET_DATE = (new Date('2020-06-25')).toISOString()

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({
  targetDate
}) => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const { product: { linkText } } = useProduct()
 const { data, loading, error } = useQuery(productReleaseDate, {
   variables: {
    slug: linkText
  },
  ssr: false
 })

 if (loading) {
  return (
    <div>
      <span>Loading...</span>
    </div>
  )
}
if (error) {
  return (
    <div>
      <span>Error!</span>
    </div>
  )
}

  
  const handles = useCssHandles('countdown')

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  return (
    <div className={`${handles.container} t-heading-2 fw3 w-100 c-muted-1`}>
      
      <div className={`${handles.countdown} db tc`}>
        {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
      </div>
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    
    targetDate: {
           title: 'Final date',
          description: 'Final date used in the countdown',
           type: 'string',
           default: null,
        }
  },
}

export default Countdown
