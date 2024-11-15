import { useProjectTasks } from '@/hooks/queries/use-project-tasks';
import { cn } from '@/lib/utils';
import {
	addDays,
	eachDayOfInterval,
	endOfDay,
	format,
	isSameDay,
	isWithinInterval,
	parseISO,
	startOfDay,
} from 'date-fns';
import { useParams } from 'react-router-dom';

export default function ProjectTasksTimeline() {
	const params = useParams();
	const { data } = useProjectTasks(params.projectId!);
	const tasks = !data ? [] : Object.values(data).flat();

	const start = new Date();
	const end = addDays(start, 13);
	const days = eachDayOfInterval({
		start,
		end,
	});

	return (
		<div className="bg-border rounded-lg border border-border overflow-hidden">
			<div className="flex gap-px border-b border-border">
				{days.map((day) => (
					<div
						key={day.toISOString()}
						className="flex-1 text-center bg-background grid text-sm"
					>
						<span>{format(day, 'do')}</span>
						<span>{format(day, 'MMM')}</span>
					</div>
				))}
			</div>
			<div
				className="grid relative h-[500px]"
				style={{
					gridTemplateColumns: `repeat(${days.length}, 1fr)`,
					gap: '1px',
				}}
			>
				{/* Background grid lines */}
				{days.map((_, index) => (
					<div key={`grid-${index}`} className="bg-background h-full" />
				))}

				{/* Tasks Container */}
				<div className="absolute inset-0">
					<div
						className="grid h-full"
						style={{ gridTemplateRows: 'repeat(auto-fill, 3rem)' }}
					>
						{tasks.map((task) => {
							const createdAt = parseISO(task.createdAt);
							const dueDate = parseISO(task.dueDate);
							const effectiveStart = createdAt < start ? start : createdAt;
							const effectiveEnd = dueDate > end ? end : dueDate;

							const startCol = days.findIndex((day) =>
								isSameDay(day, effectiveStart)
							);
							const duration = days.filter((day) =>
								isWithinInterval(day, {
									start: effectiveStart,
									end: effectiveEnd,
								})
							).length;

							return (
								<div key={task.id} className="relative h-12 flex items-center">
									{duration > 0 && (
										<div
											className={cn(
												'absolute h-8 bg-primary rounded px-2 flex items-center',
												startOfDay(createdAt) >= startOfDay(start) &&
													'rounded-l-full',
												endOfDay(dueDate) <= endOfDay(end) && 'rounded-r-full'
											)}
											style={{
												left: `${(startCol / days.length) * 100}%`,
												width: `${(duration / days.length) * 100}%`,
											}}
										>
											<span className="text-sm font-medium text-primary-foreground truncate">
												{task.name}
											</span>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
