import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Music, BarChart3, Users, Megaphone, ExternalLink, ChevronDown, Search, Hash } from 'lucide-react'
import { projects } from '../lib/dashboards'

const iconMap = {
  Music,
  BarChart3,
  Users,
  Megaphone
}

const colorClasses = {
  blue: 'bg-blue-600/20 text-blue-400',
  purple: 'bg-purple-600/20 text-purple-400',
  green: 'bg-green-600/20 text-green-400',
  orange: 'bg-orange-600/20 text-orange-400',
}
