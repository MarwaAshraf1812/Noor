import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import PropTypes from 'prop-types';

export default function AnimatedCounter({ value }) {
  const count = useMotionValue(value);
  const rounded = useTransform(count, Math.round);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const animation = animate(count, value, { duration: 0.8, ease: 'easeOut' });
    prevValueRef.current = value;
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

AnimatedCounter.propTypes = {
  value: PropTypes.number.isRequired
};
