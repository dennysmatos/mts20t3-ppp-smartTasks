import AppError from '../utils/AppError.js'
import { allowedStatus } from '../services/taskService.js'
import { getUnknownFields } from '../utils/validationHelper.js'

function validateCreateTask(request, _response, next) {
   const { title, description, status } = request.body
   const errors = []
   const allowedFields = ['title', 'description', 'status']
   const unknownFields = getUnknownFields(request.body, allowedFields)

   if (unknownFields.length > 0) {
      errors.push(`unknown fields are not allowed: ${unknownFields.join(', ')}`)
   }

   if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push('title is required')
   }

   if (!description || typeof description !== 'string' || !description.trim()) {
      errors.push('description is required')
   }

   if (!status || typeof status !== 'string' || !status.trim()) {
      errors.push('status is required')
   } else if (!allowedStatus.includes(status)) {
      errors.push('status must be one of: pending, in_progress, done')
   }

   if (errors.length > 0) {
      return next(new AppError('Validation error', 400, errors))
   }

   return next()
}

export default validateCreateTask
