<template>
  <v-expansion-panel class="blue-grey darken-4">
    <v-expansion-panel-header>{{ course.name }}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-form
        v-model="editCourseIsValid"
        @submit.prevent
      >
        <v-row
          no-gutters
          class="ma-n2"
        >
          <v-col
            cols="12"
            md="6"
            class="px-2"
          >
            <v-text-field
              v-model="editedCourse.name"
              label="Name"
              outlined
              dense
              :disabled="!isEditing"
              :rules="courseNameRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="px-2"
          >
            <ColorField
              v-model="editedCourse.color"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="px-2"
          >
            <DayField
              ref="editCourseDayField"
              v-model.number="editCourseDayNumber"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="px-2"
          >
            <TimeField
              ref="editCourseDayStartField"
              v-model="editCourseDayStart"
              label="Start Time"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="px-2"
          >
            <TimeField
              ref="editCourseDayEndField"
              v-model="editCourseDayEnd"
              label="End Time"
              :disabled="!isEditing"
            />
          </v-col>
        </v-row>
        <div class="text-center mt-2 mb-4">
          <v-btn
            color="primary"
            outlined
            :disabled="!editCourseDayIsValid || !isEditing"
            @click="addCourseDay"
          >
            Add Day
          </v-btn>
        </div>
        <v-row
          no-gutters
          justify="center"
        >
          <v-col
            cols="12"
            md="6"
          >
            <v-data-table
              dense
              disable-sort
              hide-default-footer
              mobile-breakpoint="0"
              no-data-text="Add a day above"
              class="blue-grey darken-3"
              :headers="dayHeaders"
              :items="editedCourse.days"
              :items-per-page="-1"
            >
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template #item.number="{ item }">
                {{ formatDayNumber(item.number) }}
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template #item.start="{ item }">
                {{ formatTime(item.start) }}
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template #item.end="{ item }">
                {{ formatTime(item.end) }}
              </template>
              <!-- eslint-disable-next-line vue/valid-v-slot -->
              <template #item.remove="{ item }">
                <v-btn
                  color="error"
                  icon
                  outlined
                  class="my-2"
                  :disabled="!isEditing"
                  @click="addCourseRemoveDay(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <div class="text-center mt-4 mb-n4">
          <v-btn
            outlined
            class="mb-4"
            :color="isEditing ? '' : 'primary'"
            @click="isEditing ? reset(course) : (isEditing = true)"
          >
            {{ isEditing ? 'Cancel' : 'Edit' }}
          </v-btn>
          <v-btn
            v-show="isEditing"
            color="primary"
            outlined
            class="ml-4 mb-4"
            :disabled="!editCourseIsValid || editedCourse.days.length === 0"
            @click="save"
          >
            Save
          </v-btn>
          <v-btn
            outlined
            class="ml-4 mb-4"
            :color="isRemoving ? '' : 'error'"
            @click="isRemoving = !isRemoving"
          >
            {{ isRemoving ? 'Cancel' : 'Remove' }}
          </v-btn>
          <v-btn
            v-show="isRemoving"
            color="error"
            outlined
            class="ml-4 mb-4"
            @click="remove"
          >
            Confirm
          </v-btn>
        </div>
      </v-form>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      default: () => {},
    },
    dayHeaders: {
      type: Array,
      default: () => [],
    },
    courseNameRules: {
      type: Array,
      default: () => [],
    },
    courseColorRules: {
      type: Array,
      default: () => [],
    },
  },
  data: vm => ({
    isEditing: false,
    isRemoving: false,
    editedCourse: null,
    editCourseIsValid: false,
    editCourseDayNumber: '',
    editCourseDayStart: '',
    editCourseDayEnd: '',
  }),
  computed: {
    editCourseDayIsValid() {
      return this.editCourseDayNumber !== ''
        && this.editCourseDayStart && this.$refs.editCourseDayStartField?.isValid
        && this.editCourseDayEnd && this.$refs.editCourseDayEndField?.isValid
    },
  },
  created() {
    this.reset(this.course)
  },
  methods: {
    formatDayNumber(number) {
      return this.$refs.editCourseDayField ? this.$refs.editCourseDayField.options[number].text : ''
    },
    formatTime(time) {
      let hoursInt = time.hours
      const minutesInt = time.minutes
      const isAM = hoursInt < 12
      if (hoursInt === 0) { hoursInt = 12 }
      if (hoursInt > 12) { hoursInt -= 12 }
      return `${hoursInt.toString().padStart(2, '0')}:${minutesInt.toString().padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`
    },
    addCourseDay() {
      const [startHours, startMinutes] = this.editCourseDayStart.split(':')
      const [endHours, endMinutes] = this.editCourseDayEnd.split(':')
      this.editedCourse.days.push({
        number: this.editCourseDayNumber,
        start: { hours: parseInt(startHours), minutes: parseInt(startMinutes) },
        end: { hours: parseInt(endHours), minutes: parseInt(endMinutes) },
      })
    },
    addCourseRemoveDay(day) {
      this.editedCourse.days.splice(this.editedCourse.days.indexOf(day), 1)
    },
    save() {
      this.$emit('save', this.editedCourse)
      this.reset(this.editedCourse)
    },
    remove() {
      this.$emit('remove')
    },
    reset(course) {
      this.isEditing = false
      const days = []
      course.days.forEach((day) => {
        days.push({
          number: day.number,
          start: { hours: day.start.hours, minutes: day.start.minutes },
          end: { hours: day.end.hours, minutes: day.end.minutes },
        })
      })
      this.editedCourse = {
        name: course.name,
        color: course.color,
        days,
      }
    },
  },
}
</script>
