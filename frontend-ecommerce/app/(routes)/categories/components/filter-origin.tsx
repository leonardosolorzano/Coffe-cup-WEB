"use client";

import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PRODUCT_ORIGINS, type ProductOrigin } from "@/lib/product-filters";

type FilterOriginProps = {
  value: ProductOrigin | null;
  onChange: (origin: ProductOrigin | null) => void;
};

const ALL = "__all__";

const FilterOrigin = ({ value, onChange }: FilterOriginProps) => {
  return (
    <FieldSet className="my-5">
      <FieldLegend className="font-bold">Origen</FieldLegend>

      <RadioGroup
        value={value ?? ALL}
        onValueChange={(next) =>
          onChange(next === ALL ? null : (next as ProductOrigin))
        }
      >
        <Field orientation="horizontal">
          <FieldLabel>
            <RadioGroupItem value={ALL} id="origin-all" />
            <span>Todos</span>
          </FieldLabel>
        </Field>

        {PRODUCT_ORIGINS.map((origin) => (
          <Field key={origin} orientation="horizontal">
            <FieldLabel>
              <RadioGroupItem value={origin} id={`origin-${origin}`} />
              <span>{origin}</span>
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  );
};

export default FilterOrigin;
