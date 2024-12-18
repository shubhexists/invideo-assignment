import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CodeDisplayProps {
  title: string;
  code: string;
}

export function CodeDisplay({ title, code }: CodeDisplayProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto p-4 bg-gray-800 text-white rounded-md">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
