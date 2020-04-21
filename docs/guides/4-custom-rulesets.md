# Custom Rulesets

Want to go beyond tweaking a ruleset, and learn how to make your own?

## Adding Rules

Add your own rules under the `rules` property in your `.spectral.yml`, or another ruleset file.

```yaml
rules:
  my-rule-name:
    description: Tags must have a description.
    given: $.tags[*]
    severity: error
    then:
      field: description
      function: truthy
```

Spectral has [built-in functions](../reference/functions.md) such as `truthy` or `pattern`, which can be used to power rules.

By default, Spectral processes each rule on "resolved document" (a file where all `$ref`s have been resolved. If you would like to have an original input supplied to your rule, you can place `resolved` property as follows:

```yaml
rules:
  my-rule-name:
    description: Tags must have a description.
    given: $.tags[*]
    severity: error
    resolved: false
    then:
      field: description
      function: truthy
```

You might find `resolved` useful if your rule requires access to `$ref` values specifically, for example if you want to enforce conventions on the folder structure used for [splitting up documents](https://stoplight.io/blog/keeping-openapi-dry-and-portable/).

In most cases, you will want to operate on resolved document.

### Given

The `given` property is one of only two on required properties on each rule definition (the other being `then`).

It can be any valid JSONPath expression or an array of JSONPath expressions.
[JSONPath Online Evaluator](http://jsonpath.com/) is a helpful tool to determine what `given` path you want.

### Severity

The `severity` keyword is optional and can be `error`, `warn`, `info`, or `hint`.

The default value is `warn`.

### Then

The Then part of the rules explains what to do with the `given` JSONPath, and involves two required keywords:

```yaml
then:
  field: description
  function: truthy
```

The `field` keyword is optional, and is for applying the function to a specific property in an object. If omitted the function will be applied to the entire target of the `given` JSON Path. The value can also be `@key` to apply the rule to a keys of an object.

```yaml
given: '$.responses'
then:
  field: '@key'
  function: pattern
  functionOptions:
    match: '^[0-9]+$'
```

The above pattern based rule would error on `456avbas` as it is not numeric.

```yaml
responses:
  123:
    foo: bar
  456avbas:
    foo: bar
```

## Extending Rules

When extending another ruleset, you can actually extend and modify rules it has declared by adding a rule to your own ruleset with the same name.

```yaml
extends: spectral:oas
rules:
  tag-description:
    description: Please provide a description for each tag.
    given: $.tags[*]
    then:
      field: description
      function: truthy
```

This provides a new description, and changes recommended to true, but anything can be changed.

If you're just looking change the severity of the rule, there is a handy shortcut.

### Changing rule severity

Maybe you want to use the rules from the `spectral:oas` ruleset, but instead of `operation-2xx-response` triggering an error you'd like it to trigger a warning instead.

```yaml
extends: spectral:oas
rules:
  operation-2xx-response: warn
```

Available severity levels are `error`, `warn`, `info`, `hint`, and `off`.

## Disabling rules

This example shows the opposite of the "Enabling Specific rules" example. Sometimes you might want to enable all rules by default, and disable a few.

```yaml
extends: [[spectral:oas, all]]
rules:
  operation-operationId-unique: off
```

The example above will run all of the rules defined in the `spectral:oas` ruleset (rather than the default behavior that runs only the recommended ones), with one exceptions - we turned `operation-operationId-unique` off.

### Enabling Rules

Sometimes you might want to apply specific rules from another ruleset. Use the `extends` property, and pass `off` as the second argument in order to add the rules from another ruleset, but disable them all by default. This allows you to pick and choose which rules you would like to enable.

```yaml
extends: [[spectral:oas, off]]
rules:
  # This rule is defined in the spectral:oas ruleset. We're passing `true` to turn it on and inherit the severity defined in the spectral:oas ruleset.
  operation-operationId-unique: true
```

The example above will run the single rule that we enabled, since we passed `off` to disable all rules by default when extending the `spectral:oas` ruleset.

### Enriching Messages

To help you create meaningful error messages, Spectral comes with a couple of placeholders that are evaluated at runtime.

- `{{error}}` - the error returned by function
- `{{description}}` - the description set on the rule
- `{{path}}` - the whole error path
- `{{property}}` - the last segment of error path
- `{{value}}` - the linted value

```yaml
message: "{{error}}" # will output the message generated by then.function

message: "The value of '{{property}}' property must equal 'foo'"

message: "{{value}} is greater than 0"

message: "{{path}} cannot point at remote reference"
```

## Custom Functions

Learn more about [custom functions](../guides/5-custom-functions.md).