<template>
  <div class="v-field">
    <component :is="fieldset ? 'fieldset' : 'p'">
      <div>
        <div class="heading">
          <template v-if="hideLabel === false">
            <div class="label">
              <component :is="fieldset ? 'legend' : 'label'" :for="field.field">
                {{ field.name || $helpers.formatTitle(field.field)
                }}<i
                  v-tooltip="$t('required')"
                  class="material-icons"
                  v-if="field.required === true || field.required === '1'"
                  >star</i
                >
              </component>
              <label v-if="batchMode" class="batch-label">
                <v-toggle
                  :value="!blocked"
                  @input="
                    $emit(blocked ? 'activate' : 'deactivate', field.field)
                  "
                />
              </label>
            </div>
          </template>
          <small
            v-if="!readonly && field.note"
            v-html="$helpers.snarkdown(field.note)"
          />
        </div>
        <div class="field-wrapper">
          <v-ext-input
            :id="field.interface || 'text-input'"
            :name="name"
            :required="field.required === true || field.required === '1'"
            :readonly="readonly || blocked"
            :options="field.options"
            :type="field.type"
            :datatype="field.datatype"
            :value="values[field.field]"
            :relation="relation"
            :fields="fields"
            :values="values"
            :length="field.length"
            :new-item="newItem"
            @input="
              readonly
                ? null
                : $emit('stage-value', {
                    field: field.field,
                    value: $event
                  })
            "
            @setfield="
              readonly
                ? null
                : $emit('stage-value', {
                    field: $event.field,
                    value: $event.value
                  })
            "
          />
          <div
            class="blocker"
            v-if="blocked"
            @click="$emit('activate', field.field)"
          />
        </div>
      </div>
    </component>
  </div>
</template>

<script>
export default {
  name: "v-field",
  props: {
    field: {
      type: Object,
      required: true
    },
    values: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    blocked: {
      type: Boolean,
      default: false
    },
    batchMode: {
      type: Boolean,
      default: false
    },
    fields: {
      type: Object,
      required: true
    },
    newItem: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    fieldset() {
      const interfaceInfo = this.$store.state.extensions.interfaces[
        this.field.interface
      ];

      return (interfaceInfo && interfaceInfo.fieldset) || false;
    },
    hideLabel() {
      const interfaceName = this.field.interface;
      const interfaceMeta = this.$store.state.extensions.interfaces[
        interfaceName
      ];

      if (!interfaceMeta) return false;

      if (interfaceMeta && interfaceMeta.hideLabel)
        return interfaceMeta.hideLabel;

      return false;
    },
    relation() {
      const { collection, field, type } = this.field;

      if (type.toLowerCase() === "m2o")
        return this.$store.getters.m2o(collection, field);
      if (type.toLowerCase() === "o2m")
        return this.$store.getters.o2m(collection, field);
      if (type.toLowerCase() === "translation")
        return this.$store.getters.o2m(collection, field);
      return null;
    }
  }
};
</script>

<style lang="scss" scoped>
.heading {
  margin-bottom: 14px;
}
.field-wrapper {
  position: relative;
}

label,
legend {
  text-transform: none;
  color: var(--darker-gray);
  font-size: 1.2rem;
  line-height: 1.1;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

label.batch-label {
  overflow: initial;
  display: flex;
}

fieldset,
p {
  border: 0;
  padding: 0;
}

fieldset > div,
p {
  display: flex;
  flex-direction: column;
}

small {
  order: 2;
  display: block;
  margin-top: 4px;
  font-style: italic;
  font-size: 12px;
  line-height: 1.5em;
  color: var(--light-gray);
}

.label {
  display: flex;
  align-items: center;

  > * {
    display: inline-block;
    max-width: max-content;

    &:first-child {
      margin-right: 10px;
    }
  }

  i {
    color: var(--accent);
    vertical-align: super;
    font-size: 7px;
  }
}

.blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: var(--body-background);
  opacity: 0.7;
  transition: opacity var(--fast) var(--transition-out);
  cursor: pointer;

  &:hover {
    opacity: 0.3;
    transition: opacity var(--fast) var(--transition-in);
  }
}
</style>
