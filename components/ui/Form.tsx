"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

function Form<TFieldValues extends FieldValues>({
  children,
  ...props
}: React.ComponentProps<typeof FormProvider<TFieldValues>>) {
  return <FormProvider {...props}>{children}</FormProvider>;
}

function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>,
) {
  return <Controller {...props} />;
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={className} {...props} />;
}

function FormLabel({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={className} {...props} />;
}

function FormControl({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={className} {...props} />;
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={className} {...props} />;
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription };
